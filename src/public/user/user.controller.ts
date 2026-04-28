import jwt from "jsonwebtoken";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { config } from "../../config/config";
import { User } from "../../modals/user.model";
import Otp from "../../modals/otp.model";
import { sendEmail } from "../../utils/emailService";
import { Request, Response, NextFunction } from "express";
import { CommonService } from "../../services/common.services";

export class UserController {

  // CREATE USER
  static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, mobile, password, address, coordinate, avatar } = req.body;

      if (!name || !email || !mobile || !password) {
        return res.status(400).json(new ApiError(400, "Missing required fields"));
      }

      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json(new ApiError(400, "Email already exists"));

      const user = await User.create({
        name,
        email,
        mobile,
        password,
        address,
        coordinate,
        avatar,
        status: "active",
      });

      return res
        .status(201)
        .json(new ApiResponse(201, user, "User created successfully"));
    } catch (err) {
      next(err);
    }
  }

  // LOGIN USER
  static async loginUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password)
        return res.status(400).json({ message: "Email & password required" });

      const user = await User.findOne({ email }).select("+password");
      if (!user) return res.status(401).json({ message: "Invalid email or password" });

      const isMatch = await user.comparePassword(password);
      if (!isMatch)
        return res.status(401).json({ message: "Invalid email or password" });

      const token = jwt.sign(
        { _id: user._id, email: user.email },
        config.jwt.secret as string,
        { expiresIn: "7d" }
      );

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user,
      });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // GENERATE OTP
  static async generateOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      if (!email)
        return res.status(400).json({ success: false, message: "Email required" });

      const user = await User.findOne({ email });
      if (!user)
        return res.status(404).json({ success: false, message: "User not found" });

      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      await Otp.findOneAndUpdate(
        { email },
        { email, otp: otpCode, expiresAt, verified: false },
        { upsert: true, new: true }
      );

      console.log(`OTP: ${otpCode}`);

      await sendEmail({
        otp: otpCode,
        to: user.email,
        userName: user.name,
      });

      return res.status(200).json({
        success: true,
        message: "OTP sent successfully",
      });
    } catch (err) {
      next(err);
    }
  }

  // VERIFY OTP
  static async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email,mobile, otp, newPassword } = req.body;

      const record = await Otp.findOne({ email });
      if (!record)
        return res.status(404).json({ success: false, message: "OTP not found" });

      if (record.otp !== otp)
        return res.status(400).json({ success: false, message: "Invalid OTP" });

      if (record.expiresAt < new Date())
        return res.status(400).json({ success: false, message: "OTP expired" });

      await User.findOneAndUpdate({ email }, { password: newPassword });

      record.verified = true;
      await record.save();

      return res.status(200).json({
        success: true,
        message: "Password reset successful",
      });
    } catch (err) {
      next(err);
    }
  }

  // UPDATE USER
  static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;

      const updated = await User.findByIdAndUpdate(
        userId,
        req.body,
        { new: true }
      );

      if (!updated)
        return res.status(404).json(new ApiError(404, "User not found"));

      return res
        .status(200)
        .json(new ApiResponse(200, updated, "User updated successfully"));
    } catch (err) {
      next(err);
    }
  }

  // DELETE USER
  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;

      const deleted = await User.findByIdAndDelete(userId);
      if (!deleted)
        return res.status(404).json(new ApiError(404, "User not found"));

      return res
        .status(200)
        .json(new ApiResponse(200, deleted, "User deleted successfully"));
    } catch (err) {
      next(err);
    }
  }

  // GET ALL OTPS
  static async getAllOtps(req: Request, res: Response, next: NextFunction) {
    try {
      const otpService = new CommonService(Otp);
      const result = await otpService.getAll(req.query);
      return res
        .status(200)
        .json(new ApiResponse(200, result, "OTPs fetched successfully"));
    } catch (err) {
      next(err);
    }
  }

  // ADD ADDRESS
  static async addAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user._id;
      const { label, fullAddress, coordinates, isDefault } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json(new ApiError(404, "User not found"));
      }

      // If isDefault is true, unset other defaults
      if (isDefault) {
        user.addresses.forEach((addr: any) => {
          addr.isDefault = false;
        });
      }

      user.addresses.push({ label, fullAddress, coordinates, isDefault } as any);
      await user.save();

      return res
        .status(200)
        .json(new ApiResponse(200, user.addresses, "Address added successfully"));
    } catch (err) {
      next(err);
    }
  }

  // GET ADDRESSES
  static async getAddresses(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user._id;
      const user = await User.findById(userId).select("addresses");

      if (!user) {
        return res.status(404).json(new ApiError(404, "User not found"));
      }

      return res
        .status(200)
        .json(new ApiResponse(200, user.addresses, "Addresses fetched successfully"));
    } catch (err) {
      next(err);
    }
  }

  // UPDATE ADDRESS
  static async updateAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user._id;
      const { addressId } = req.params;
      const { label, fullAddress, coordinates, isDefault } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json(new ApiError(404, "User not found"));
      }

      const address = (user.addresses as any[]).find(
        (addr) => addr._id.toString() === addressId
      );

      if (!address) {
        return res.status(404).json(new ApiError(404, "Address not found"));
      }

      if (label) address.label = label;
      if (fullAddress) address.fullAddress = fullAddress;
      if (coordinates) address.coordinates = coordinates;
      if (isDefault !== undefined) {
        if (isDefault) {
          user.addresses.forEach((addr: any) => {
            addr.isDefault = false;
          });
        }
        address.isDefault = isDefault;
      }

      await user.save();

      return res
        .status(200)
        .json(new ApiResponse(200, user.addresses, "Address updated successfully"));
    } catch (err) {
      next(err);
    }
  }

  // DELETE ADDRESS
  static async deleteAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user._id;
      const { addressId } = req.params;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json(new ApiError(404, "User not found"));
      }

      user.addresses = (user.addresses as any[]).filter(
        (addr) => addr._id.toString() !== addressId
      );

      await user.save();

      return res
        .status(200)
        .json(new ApiResponse(200, user.addresses, "Address deleted successfully"));
    } catch (err) {
      next(err);
    }
  }
}
