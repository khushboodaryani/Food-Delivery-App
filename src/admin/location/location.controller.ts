import { Request, Response, NextFunction } from "express";
import Country from "../../modals/country.model";
import State from "../../modals/state.model";
import City from "../../modals/city.model";
import { CommonService } from "../../services/common.services";
import ApiResponse from "../../utils/ApiResponse";

const countryService = new CommonService(Country);
const stateService = new CommonService(State);
const cityService = new CommonService(City);

export class LocationController {
  /**
   * Get all countries with pagination
   */
  static async getAllCountries(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await countryService.getAll(req.query);
      return res
        .status(200)
        .json(new ApiResponse(200, result, "Countries fetched successfully"));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all states with pagination
   */
  static async getAllStates(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await stateService.getAll(req.query);
      return res
        .status(200)
        .json(new ApiResponse(200, result, "States fetched successfully"));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all cities with pagination
   */
  static async getAllCities(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await cityService.getAll(req.query);
      return res
        .status(200)
        .json(new ApiResponse(200, result, "Cities fetched successfully"));
    } catch (error) {
      next(error);
    }
  }
}
