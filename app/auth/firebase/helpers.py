import hashlib

def create_hash(base: str) -> str:
    return hashlib.sha256(base.encode('utf‑8')).hexdigest()

def create_handle(base: str) -> str:
    hashed = create_hash(base)
    return 'user' + hashed[:10]
