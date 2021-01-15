import * as changeCase from "change-case";
import { Relation } from "../models/Relation";
import commonHelpers from "./common";

export default (generationOptions) => ({
    ...commonHelpers(generationOptions),
});
