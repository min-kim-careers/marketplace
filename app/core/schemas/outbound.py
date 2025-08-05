from typing import Optional
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class OutboundBase(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        extra="ignore",
        validate_by_alias=True,
        validate_by_name=True,
    )


class APIResponse(OutboundBase):
    message: Optional[str] = None
    data: Optional[dict] = None
