import { ArgumentsHost } from "@nestjs/common";
import { CustomException } from "../exceptions/custom.exception";
import { CustomExceptionFilter } from "./http-exception.filter";

describe('CustomHttpExceptionFilter', () => {
  let filter: CustomExceptionFilter;

  beforeEach(() => {
    filter = new CustomExceptionFilter();
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should respond with the correct status from HttpException', () => {
    const exception = new CustomException('Unauthorized', 401);
    jest.spyOn(exception, 'getStatus').mockReturnValue(401);

    // Request and Response mocks
    const mockJson = jest.fn();
    const mockStatus = jest.fn().mockReturnValue({ json: mockJson });

    const response = { status: mockStatus } as any;
    const request = { url: '/test' } as any;

    const host = {
      switchToHttp: () => ({
        getResponse: () => response,
        getRequest: () => request,
      }),
    } as ArgumentsHost;

    const filter = new CustomExceptionFilter();
    filter.catch(exception, host);

    expect(mockStatus).toHaveBeenCalledWith(401);
    expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
      error: 'Unauthorized',
      path: '/test',
      timestamp: expect.any(String),
    }));
  });
});