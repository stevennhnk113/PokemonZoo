import { Always, CRUDResult } from "./Constant";

export class Pokemon {
	public Name: string;

	constructor()
	constructor(data: any)
	constructor(data?: any) {
		if(data == null) {
			this.Name = "";
		} else {
			this.Name = data.Name;
		}
	}

	GetJson() : any {
		var temp = {
			Name: this.Name
		}

		return temp;
	}
}