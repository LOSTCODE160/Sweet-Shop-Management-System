try:
    import email_validator
    print("email_validator version:", email_validator.__version__)
    from pydantic import EmailStr, BaseModel
    class User(BaseModel):
        email: EmailStr
    print("Pydantic EmailStr works")
except Exception as e:
    print(e)
