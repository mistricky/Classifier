export class CategoryManager {
  private constructor() {}

  private _categories: string[] = [];

  static instance: CategoryManager;
  static createInstance() {
    console.info("instance");
    return (
      CategoryManager.instance ||
      (CategoryManager.instance = new CategoryManager())
    );
  }

  addCategory(categoryName: string) {
    this._categories.push(categoryName);
  }

  removeCategory(categoryName: string) {
    let categories = this._categories;
    categories.splice(categories.indexOf(categoryName), 1);
  }

  get categories() {
    return this._categories;
  }

  set categories(categories: string[]) {
    this._categories = categories;
  }
}
