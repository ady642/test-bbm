export class Paginator<T> {
  private items: T[];
  private currentPage: number;
  private pageSize: number;

  constructor(items: T[], pageSize: number = 10) {
    this.items = items;
    this.pageSize = pageSize;
    this.currentPage = 1;
  }

  getCurrentPage(): number {
    return this.currentPage;
  }

  getPageSize(): number {
    return this.pageSize;
  }

  getTotalPages(): number {
    if (this.items.length === 0) return 0;
    return Math.ceil(this.items.length / this.pageSize);
  }

  getTotalItems(): number {
    return this.items.length;
  }

  getCurrentPageItems(): T[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.items.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.hasNextPage()) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.hasPreviousPage()) {
      this.currentPage--;
    }
  }

  goToPage(page: number): void {
    const totalPages = this.getTotalPages();
    if (totalPages === 0) {
      this.currentPage = 1;
      return;
    }
    this.currentPage = Math.max(1, Math.min(page, totalPages));
  }

  goToFirstPage(): void {
    this.currentPage = 1;
  }

  goToLastPage(): void {
    const totalPages = this.getTotalPages();
    this.currentPage = totalPages > 0 ? totalPages : 1;
  }

  hasNextPage(): boolean {
    return this.currentPage < this.getTotalPages();
  }

  hasPreviousPage(): boolean {
    return this.currentPage > 1;
  }

  isFirstPage(): boolean {
    return this.currentPage === 1;
  }

  isLastPage(): boolean {
    return this.currentPage === this.getTotalPages();
  }

  updateItems(items: T[]): void {
    this.items = items;
    this.currentPage = 1;
  }

  getPageRange(): { start: number; end: number } {
    if (this.items.length === 0) {
      return { start: 0, end: 0 };
    }
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(start + this.pageSize - 1, this.items.length);
    return { start, end };
  }
}
