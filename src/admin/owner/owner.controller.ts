import mongoose, { Schema, Document } from "mongoose";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs"
import Otp from "../../modals/otp.model";
import { Owner } from "../../modals/owner.model";
import ApiResponse from "../../utils/ApiResponse";
import ApiError from "../../utils/ApiError";
import { sendEmail } from "../../utils/emailService";
import { CommonService } from "../../services/common.services";
import jwt from "jsonwebtoken";
import { config } from "../../config/config";

const ownerService = new CommonService(Owner);
const otpService = new CommonService(Otp);

export class OwnerController {

    static async createOwner(req: Request, res: Response, next: NextFunction) {
        try {
            const { firstName, lastName, email, mobile, password, avatar } = req.body;

            if (!firstName || !lastName || !email || !mobile || !password) {
                return res.status(400).json(new ApiError(400, "Missing required fields"));
            }

            const exists = await Owner.findOne({ email });
            if (exists) {
                return res
                    .status(400)
                    .json(new ApiError(400, "Email already exists"));
            }
            const owner = await ownerService.create({
                firstName,
                lastName,
                email,
                mobile,
                password,
                avatar
            });
            return res.status(201).json(new ApiResponse(201, owner, "Owner created successfully"));

        } catch (err) {
            next(err);
        }
    }

    static async logineOwner(req: Request, res: Response, next: NextFunction) {
        try {

        } catch (err) {
            next(err);
        }
    }

    static async loginOwner(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const owner: any = await Owner.findOne({ email }).select("+password");
            if (!owner) {
                return res
                    .status(404)
                    .json(new ApiError(404, "Owner not found"))
            }
            const isMatch = await owner.comparePassword(password);
            if (!isMatch) {
                return res
                    .status(401)
                    .json(new ApiError(401, "Invalid email or password"))
            }
            const payload = {
                _id: owner._id,
                email: owner.email,
                role: "owner",
            }

            const token = jwt.sign(payload, config.jwt.secret, {
                expiresIn: " 7d",
            });
            return res.status(200).json({
                success: true,
                message: "Login successful",
                owner,
                token,
            });
        } catch (err) {
            next(err);
        }
    }

    static async generateOtp(req: Request, res: Response, next: NextFunction) {
        try {
            const { mobile } = req.body;

            if (!mobile) {
                return res
                    .status(400)
                    .json(new ApiError(400, "Missing required fields"));
            }
            const owner = await Owner.findOne({ mobile });
            if (!owner) {
                return res
                    .status(404)
                    .json(new ApiError(404, "Owner not found"));
            }
            const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

            await Otp.findOneAndUpdate(
                { mobile },
                { mobile, otp: otpCode, expiresAt, verified: false },
                { upsert: true, new: true }
            );

            // Send OTP to email (you can add SMS later)
            await sendEmail({
                otp: otpCode,
                to: owner.email,
                 userName: `${owner.firstName} ${owner.lastName}`,
            });
             return res.status(200).json({
        success: true,
        message: "OTP sent successfully",
      });

        } catch (err) {
            next(err);
        }
    }
    static async deleteOwner(req: Request , res: Response, next:NextFunction){
        try{
         const {_id}= (req as any).user;
         const deleted = await ownerService.deleteById(_id);
        if (!deleted) {
        return res.status(404).json(new ApiError(404, "Failed to delete owner"));
      }

         return res
          .status(200)
          .json(new ApiResponse(200, deleted, "Deleted successfully"));
        }catch(err){
            next(err);
        }
    }
}