export class CategoryManager {
  private constructor() {}

  private _categories: string[] = [];

  static instance: CategoryManager;
  static createInstance() {
    return (
      CategoryManager.instance ||
      (CategoryManager.instance = new CategoryManager())
    );
  }

  get categories() {
    return this._categories;
  }

  set categories(categories: string[]) {
    this._categories = categories;
  }
}
