export interface ICategory{
    brand: string,
    models: []
}
export interface ICarListing{
    id: string,
    userId: string,
    brand: string,
    model:string,
    year: number,
    mileage: number,
    engineVolume: number,
    price: number,
    currency: string,
    description:string,
    images: string[]
}