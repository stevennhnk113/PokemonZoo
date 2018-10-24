import * as Alexa from 'ask-sdk';

// Helper
import { Handler } from "./Constant";
import { Pokemon } from "./Class";

var request = require('request-promise');

const LaunchRequestHandler = {
	canHandle(handlerInput: Alexa.HandlerInput) {
		return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
	},
	async handle(handlerInput: Alexa.HandlerInput) {
		var speechText = "";
		
		var result = await handlerInput.attributesManager.getPersistentAttributes();
		
		if(Object.keys(result).length === 0){
			speechText += 	"Do you want to know who are you as a pokemon today? ";

			let pokemon = new Pokemon();
			let initialUserAttributes = pokemon.GetJson();

			handlerInput.attributesManager.setPersistentAttributes(initialUserAttributes);
			handlerInput.attributesManager.savePersistentAttributes();

			handlerInput.attributesManager.setSessionAttributes(
				{
					IsFirstSession: true,
					YesHandler: Handler.GetPokemonIntentHandler,
					NoHandler: Handler.GoodByeIntentHandler
				}
			);

		} else {
			speechText += "Hi there, wondering what pokemon are you today?";

			handlerInput.attributesManager.setSessionAttributes(
				{
					IsFirstSession: false,
					YesHandler: Handler.GetPokemonIntentHandler,
					NoHandler: Handler.GoodByeIntentHandler
				}
			);
		}

		return handlerInput.responseBuilder
			.speak(speechText)
			.withShouldEndSession(false)
			.getResponse();
	}
};

const GetPokemonIntentHandler = {
	canHandle(handlerInput: Alexa.HandlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest'
			&& handlerInput.requestEnvelope.request.intent.name === 'GetPokemonIntent';
	},
	async handle(handlerInput: Alexa.HandlerInput) {
		let speechText = '';
		let pokemon = await handlerInput.attributesManager.getPersistentAttributes() as Pokemon;
		pokemon = await GetPokemon(pokemon);

		speechText += "You will be " + pokemon.Name + " today";

		return handlerInput.responseBuilder
			.speak(speechText)
			.getResponse();
	}
};

function GetPokemon(pokemon: Pokemon) : Promise<Pokemon> {
	return new Promise((resolve, reject) => {
		let randomPokemonIndex = GetRandomPokemonIndex(1, 803);

		request({
			"method": "GET",
			"uri": "https://pokeapi.co/api/v2/pokemon/" + randomPokemonIndex,
			"json": true,
		})
		.then((data:any) =>{
			pokemon.Name = data.name;
			resolve(pokemon);
		})
		.catch((error: any) => {
			reject();
		})
	});
}

function GetRandomPokemonIndex(min: number, max: number) {
	// Not the best, need to use a different way to get random number
	return Math.floor(Math.random() * (max - min)) + min;
}

const HelpIntentHandler = {
	canHandle(handlerInput: Alexa.HandlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest'
			&& handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
	},
	handle(handlerInput: Alexa.HandlerInput) {
		const speechText = 	"I will get a random pokemon every time you open the skill.";

		return handlerInput.responseBuilder
			.speak(speechText)
			.reprompt(speechText)
			.withShouldEndSession(false)
			.getResponse();
	}
};

const CancelAndStopIntentHandler = {
	canHandle(handlerInput: Alexa.HandlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest'
			&& (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
				|| handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
	},
	handle(handlerInput: Alexa.HandlerInput) {
		const speechText = 'Goodbye!';

		return handlerInput.responseBuilder
			.speak(speechText)
			.withSimpleCard('Goodbye', speechText)
			.getResponse();
	}
};

const YesIntentHandler = {
	canHandle(handlerInput: Alexa.HandlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest'
			&& (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent');
	},
	handle(handlerInput: Alexa.HandlerInput) {
		let sessionAttributes =  handlerInput.attributesManager.getSessionAttributes();

		switch(sessionAttributes.YesHandler)
		{
			case Handler.GetPokemonIntentHandler:
				//handlerInput.requestEnvelope.request.intent = 'GetPokemonIntentHandler';
				return GetPokemonIntentHandler.handle(handlerInput);
			default:
				var speechText = "Sorry! We encounter a problem.";

				return handlerInput.responseBuilder
				.speak(speechText)
				.getResponse();
		}
	}
};

const NoIntentHandler = {
	canHandle(handlerInput: Alexa.HandlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest'
			&& (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent');
	},
	handle(handlerInput: Alexa.HandlerInput) {
		let sessionAttributes =  handlerInput.attributesManager.getSessionAttributes();

		switch(sessionAttributes.NoHandler)
		{
			case Handler.GoodByeIntentHandler:
				return GoodByeIntentHandler.handle(handlerInput);
			default:
				var speechText = "Sorry! We encounter a problem.";

				return handlerInput.responseBuilder
				.speak(speechText)
				.getResponse();
		}
	}
};

const SessionEndedRequestHandler = {
	canHandle(handlerInput: Alexa.HandlerInput) {
		return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
	},
	handle(handlerInput: Alexa.HandlerInput) {
		//any cleanup logic goes here

		return handlerInput.responseBuilder.getResponse();
	}
};

// Internal Handler
const GoodByeIntentHandler = {
	canHandle(handlerInput: Alexa.HandlerInput) {
		return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
	},
	handle(handlerInput: Alexa.HandlerInput) {
		let sessionAttributes =  handlerInput.attributesManager.getSessionAttributes();
		
		console.log(sessionAttributes);

		let speechText = "";
		if(sessionAttributes.GoingOut === "Yes"){
			speechText = "Have fun";
		}
		else
		{
			speechText = 'GoodBye!';
		}

		return handlerInput.responseBuilder
			.speak(speechText)
			.getResponse();
	}
};


// Lambda init
var persistenceAdapterConfig = {
	tableName: "PokemonZoo",
	partitionKeyName: "userId",
	createTable: true,
	//attributesName: undefined,
	//dynamoDBClient: undefined,
	//partitionKeyGenerator: undefined
};

var persistenceAdapter = new Alexa.DynamoDbPersistenceAdapter(persistenceAdapterConfig);

exports.handler = Alexa.SkillBuilders.standard()
	.addRequestHandlers(LaunchRequestHandler,
		GetPokemonIntentHandler,
		HelpIntentHandler,
		CancelAndStopIntentHandler,
		YesIntentHandler,
		NoIntentHandler,
		SessionEndedRequestHandler)
	.withTableName("PokemonZoo")
	.withAutoCreateTable(true)
	.lambda(); 