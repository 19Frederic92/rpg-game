from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql://rpguser:changeme@db:5432/rpgdb"
    secret_key: str = "supersecretkey_change_in_production"

    class Config:
        env_file = ".env"


settings = Settings()
