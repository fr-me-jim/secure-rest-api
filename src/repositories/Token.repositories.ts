// models
import Token from '../models/Token.model';

// interfaces
import { ITokenRepositories } from '../interfaces/Token.interface';

/**
 * @class TokenRepositories
 * @desc Responsible for handling database operations in table Token
 **/
class TokenRepositories implements ITokenRepositories{
    private readonly _model = Token;

    constructor() {};

    /**
     * @method CreateNewBlacklistedToken
     * @desc Method to add a new blacklisted token to the database
     **/
    public readonly createNewBlacklistedToken = async (token: string, user_id: string): Promise<Token> => {
        if (!token || !user_id) throw new Error("Wrong number of parameters.");

        try {
            const result = await this._model.create({ token, user_id }, { 
                returning: true,
                raw: true 
            });

            return result;
        } catch (error) {
            throw error;
        }
    };

};

export default TokenRepositories;