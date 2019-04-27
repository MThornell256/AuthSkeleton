
export interface IRepository<T> {

    list(): Promise<T[]>;
    get(id: number): Promise<T>;
    insert(data: T): Promise<T>;
    update(data: T): Promise<T>;
    delete(id: number): Promise<boolean>;
}
