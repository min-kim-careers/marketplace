from app.auth.firebase.dependencies import resolve_firebase_session
from app.core.schemas.error import ErrorResponse
from app.db.models.user import UserDB
from app.profile.schemas.inbound import ProfileIn
from app.profile.schemas.outbound import ProfileExtraOut


from fastapi import Body, Depends


from datetime import datetime


def resolve_profile_in(
    user: UserDB = Depends(resolve_firebase_session),
    profile_in: ProfileIn = Body(...),
):
    if profile_in.handle:
        extra = user.profile.extra
        if extra.next_handle_update > datetime.now():
            raise ErrorResponse(
                status_code=404,
                message=f"Handle cannot be updated until {extra.next_handle_update}",
            )
    return user
