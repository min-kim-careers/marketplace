from app.auth.firebase.dependencies import resolve_firebase_session
from app.core.schemas.error import ErrorResponse
from app.db.models.user import UserDB
from app.profile.schemas.inbound import ProfileIn
from app.profile.schemas.outbound import ProfileExtraOut


from fastapi import Body, Depends


from datetime import datetime, timezone


def resolve_profile_in(
    user: UserDB = Depends(resolve_firebase_session),
    profile_in: ProfileIn = Body(...),
):
    if not profile_in.model_fields_set:
        raise ErrorResponse(
            status_code=404,
            message=f"Request body was empty",
        )

    extra = user.profile.extra

    if profile_in.handle and extra.next_handle_update > datetime.now(timezone.utc):
        raise ErrorResponse(
            status_code=404,
            message=f"Handle cannot be updated until {extra.next_handle_update}",
        )

    if profile_in.email and extra.next_email_update > datetime.now(timezone.utc):
        raise ErrorResponse(
            status_code=404,
            message=f"Email cannot be updated until {extra.next_email_update}",
        )
    return user
