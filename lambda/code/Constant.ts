export const ToBringItemLists = "ToBringItemLists";
export const Always = "always";
export const ItemType = "ItemType";

export enum CRUDResult
{
	Success = "Success",
	Failed = "Failed",
	Exist = "Exist",
	NotExist = "Not Exist"
}

export enum Handler
{
	LaunchRequestHandler = "LaunchRequestHandler",
	GetPokemonIntentHandler = "GetPokemonIntentHandler",
	GoodByeIntentHandler = "GoodByeIntentHandler"
}