import { Always, CRUDResult } from "./Constant";

export class Pokemon {
	public Name: string;
	public Date: Date;

	constructor()
	constructor(data: any)
	constructor(data?: any) {
		if(data == null) {
			this.Name = "";
			this.Date = new Date(0, 1, 1);
		} else {
			this.Name = data.Name;
			this.Date = new Date(data.Date);
		}
	}

	GetJson() : any {
		var temp = {
			Name: this.Name,
			Date: this.Date.toDateString()
		}

		return temp;
	}
}