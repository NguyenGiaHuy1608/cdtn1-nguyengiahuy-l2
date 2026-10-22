from src.repositories.catalog_repository import CatalogRepository

class CatalogService:
    def __init__(self, repo=None):
        self.repo = repo or CatalogRepository()

    def list_devices(self):
        return self.repo.list_devices()

    def list_categories(self):
        return self.repo.list_categories()
