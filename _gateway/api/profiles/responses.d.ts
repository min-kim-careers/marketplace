import { ServiceResponse } from "@/_gateway/_common/service.response";
import { Profile } from "@/lib/interfaces/profiles";

export interface CreateProfileServiceResponse extends ServiceResponse {
  profile: Profile
}

export interface GetProfileServiceResponse extends ServiceResponse {
  profile: Profile
}