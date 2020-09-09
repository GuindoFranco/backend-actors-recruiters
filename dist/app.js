"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = __importDefault(require("./routes/auth"));
const port = 3000;
const app = express_1.default();
app.use(body_parser_1.default.json());
app.use('/auth', auth_1.default);
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});
mongoose_1.default
    .connect("mongodb+srv://usrTalentApp:SEAikcSKnUK2Y93@cluster0.zy1bb.mongodb.net/devDataBase?retryWrites=true&w=majority")
    .then(result => {
    app.listen(port);
    console.log(`Conectado en el puerto: ${port}`);
})
    .catch((err) => {
    console.log(err);
});
