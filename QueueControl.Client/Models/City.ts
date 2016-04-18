module Application.Models {
    export class Animal {
        public _id: string;
        public Contact: string;
        public LongDescription: string;
        public ShortDescription: string;
        public ImageURL: string;
        public City_id: string;
        public AnimalType_id: string;
        public Sex: string;
        public IsLost: boolean;
        public Name: string;
        public Date: Date;
    }
}