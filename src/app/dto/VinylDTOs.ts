import { Vinyl } from "src/app/models/vinyl";

export interface ICreateVinylDTO extends Vinyl {

}

export interface IUpdateVinylDTO extends Partial<Vinyl> {
    
}

