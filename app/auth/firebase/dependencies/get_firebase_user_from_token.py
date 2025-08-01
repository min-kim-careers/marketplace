from app.auth.firebase.schemas.outbound import FirebaseUser
from app.core.schemas.error import ErrorResponse


from fastapi import Body, status
from firebase_admin import auth
from firebase_admin.exceptions import FirebaseError


async def get_firebase_user_from_token(
    id_token: str | None = Body(default=None, embed=True, alias="idToken"),
) -> FirebaseUser:
    if not id_token:
        raise ErrorResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            message="Not authenticated: No id token found.",
        )
    try:
        token_data = auth.verify_id_token(id_token, check_revoked=True)

        firebase_user = FirebaseUser(
            uid=token_data["uid"],
            email=token_data["email"],
            picture=token_data["picture"],
        )

        # print(f"UID: {firebase_user.uid} verified, Email: {firebase_user.email}")

        return firebase_user
    except FirebaseError as e:
        print(f"Id token verification failed: {e}")
        raise ErrorResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            message=f"Invalid or expired id token: {e}",
        )
    except Exception as e:
        print(f"Unexpected error during id token verification: {e}")
        raise ErrorResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error during authentication.",
        )