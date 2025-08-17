from app.core import env_loader


import hashlib
import hmac


def create_mac(
    nonce,
    username,
    password,
    admin=False,
):
    message = b"\0".join(
        [
            nonce.encode("utf-8"),
            username.encode("utf-8"),
            password.encode("utf-8"),
            b"admin" if admin else b"notadmin",
        ]
    )
    mac = hmac.new(
        env_loader.SYNAPSE_SHARED_SECRET.encode("utf-8"),
        message,
        hashlib.sha1,
    )
    return mac.hexdigest()