"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../src/server");
describe('E2E Tests', () => {
    let server;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        server = yield (0, server_1.initializeServer)();
    }));
    it('should get a response with status code 200', () => __awaiter(void 0, void 0, void 0, function* () {
        yield server.inject({
            method: 'GET',
            url: '/ping'
        })
            .then(response => {
            expect(response.statusCode).toBe(200);
            expect(response.result).toEqual({ ok: true });
        });
    }));
    describe("Basic Items functionality", () => {
        it("should be able to list all items", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield server.inject({
                method: 'GET',
                url: '/items'
            });
            expect(response.statusCode).toBe(200);
            expect(response.result).toEqual([]);
            yield server.inject({
                method: 'POST',
                url: '/items',
                payload: {
                    name: 'Item 1',
                    price: 10
                }
            });
            const response2 = yield server.inject({
                method: 'GET',
                url: '/items'
            });
            expect(response2.statusCode).toBe(200);
            expect(response2.result).toEqual([{
                    id: expect.any(Number),
                    name: 'Item 1',
                    price: 10
                }]);
        }));
        it("should be able to create a new item and get it by id", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield server.inject({
                method: 'POST',
                url: '/items',
                payload: {
                    name: 'Item 1',
                    price: 10
                }
            });
            expect(response.statusCode).toBe(201);
            expect(response.result).toEqual({
                id: expect.any(Number),
                name: 'Item 1',
                price: 10
            });
            const response2 = yield server.inject({
                method: 'GET',
                url: `/items/${response.result.id}`
            });
            expect(response2.statusCode).toBe(200);
            expect(response2.result).toEqual({
                id: expect.any(Number),
                name: 'Item 1',
                price: 10
            });
        }));
        it("should be able to update an item", () => __awaiter(void 0, void 0, void 0, function* () {
            const { result: createdItem } = yield server.inject({
                method: 'POST',
                url: '/items',
                payload: {
                    name: 'Item 1',
                    price: 10
                }
            });
            expect(createdItem).toBeDefined();
            const response = yield server.inject({
                method: 'PUT',
                url: `/items/${createdItem.id}`,
                payload: {
                    name: 'Item 1 updated',
                    price: 20
                }
            });
            expect(response.statusCode).toBe(200);
            expect(response.result).toEqual({
                id: createdItem.id,
                name: 'Item 1 updated',
                price: 20
            });
            const response2 = yield server.inject({
                method: 'GET',
                url: `/items/${createdItem.id}`
            });
            expect(response2.statusCode).toBe(200);
            expect(response2.result).toEqual({
                id: createdItem.id,
                name: 'Item 1 updated',
                price: 20
            });
        }));
        it("should be able to delete an item", () => __awaiter(void 0, void 0, void 0, function* () {
            const { result: createdItem } = yield server.inject({
                method: 'POST',
                url: '/items',
                payload: {
                    name: 'Item 1',
                    price: 10
                }
            });
            expect(createdItem).toBeDefined();
            const response = yield server.inject({
                method: 'DELETE',
                url: `/items/${createdItem.id}`
            });
            expect(response.statusCode).toBe(204);
            const response2 = yield server.inject({
                method: 'GET',
                url: `/items/${createdItem.id}`
            });
            expect(response2.statusCode).toBe(404);
        }));
    });
    describe("Validations", () => {
        it("should validate required fields", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield server.inject({
                method: 'POST',
                url: '/items',
                payload: {
                    name: 'Item 1'
                }
            });
            expect(response.statusCode).toBe(400);
            expect(response.result).toEqual({
                errors: [
                    {
                        field: 'price',
                        message: 'Field "price" is required'
                    }
                ]
            });
        }));
        it("should not allow for negative pricing for new items", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield server.inject({
                method: 'POST',
                url: '/items',
                payload: {
                    name: 'Item 1',
                    price: -10
                }
            });
            expect(response.statusCode).toBe(400);
            expect(response.result).toEqual({
                errors: [
                    {
                        field: 'price',
                        message: 'Field "price" cannot be negative'
                    }
                ]
            });
        }));
        it("should not allow for negative pricing for updated items", () => __awaiter(void 0, void 0, void 0, function* () {
            const { result: createdItem } = yield server.inject({
                method: 'POST',
                url: '/items',
                payload: {
                    name: 'Item 1',
                    price: 10
                }
            });
            expect(createdItem).toBeDefined();
            const response = yield server.inject({
                method: 'PUT',
                url: `/items/${createdItem.id}`,
                payload: {
                    name: 'Item 1 updated',
                    price: -20
                }
            });
            expect(response.statusCode).toBe(400);
            expect(response.result).toEqual({
                errors: [
                    {
                        field: 'price',
                        message: 'Field "price" cannot be negative'
                    }
                ]
            });
        }));
    });
    afterAll(() => {
        return server.stop();
    });
});
