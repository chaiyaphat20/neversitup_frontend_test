import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import axios, { AxiosResponse, AxiosError } from "axios";
import { getToken } from "next-auth/jwt";
import fs from "fs";
import path from "path";
import { HttpMethod } from "@/utils/enum";


const ALLOWED_HEADERS = [""];

export async function PATCH(req: NextRequest) {
  try {
    const apiEndpoint = createApiEndpoint(req);

    const { headers, body, isFormData } = await prepareRequestData(req);

    const responseData = await sendPatchRequest(apiEndpoint, headers, body, isFormData);

    logRequestIfNeeded(req, apiEndpoint, HttpMethod.PATCH, headers, body, responseData);

    return NextResponse.json(
      {
        statusCode: responseData.status,
        message: responseData.statusText,
        data: responseData.data
      },
      { status: responseData.status }
    );

  } catch (error) {
    return handleApiError(req, HttpMethod.POST, error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const apiEndpoint = createApiEndpoint(req);

    const { headers, body, isFormData } = await prepareRequestData(req);

    const responseData = await sendPostRequest(apiEndpoint, headers, body, isFormData);

    logRequestIfNeeded(req, apiEndpoint, HttpMethod.POST, headers, body, responseData);

    return NextResponse.json(
      {
        statusCode: responseData.status,
        message: responseData.statusText,
        data: responseData.data
      },
      { status: responseData.status }
    );

  } catch (error) {
    return handleApiError(req, HttpMethod.POST, error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const apiEndpoint = createApiEndpoint(req);
    const headers = await prepareHeaders(req);
    const responseData = await axios.delete(apiEndpoint, { headers });
    logRequestIfNeeded(req, apiEndpoint, HttpMethod.DELETE, headers, undefined, responseData);

    return NextResponse.json(
      {
        statusCode: responseData.status,
        message: responseData.statusText,
        data: responseData.data
      },
      { status: responseData.status }
    );

  } catch (error) {
    return handleApiError(req, HttpMethod.GET, error);
  }
}

export async function GET(req: NextRequest) {
  try {
    const apiEndpoint = createApiEndpoint(req);
    const headers = await prepareHeaders(req);
    const responseData = await axios.get(apiEndpoint, { headers });
    logRequestIfNeeded(req, apiEndpoint, HttpMethod.GET, headers, undefined, responseData);

    return NextResponse.json(
      {
        statusCode: responseData.status,
        message: responseData.statusText,
        data: responseData.data
      },
      { status: responseData.status }
    );

  } catch (error) {
    return handleApiError(req, HttpMethod.GET, error);
  }
}


function createApiEndpoint(req: NextRequest): string {
  const url = new URL(req.url);
  
  const filteredPath = url.pathname
    .split("/")
    .filter(segment => segment !== "api")
    .join("/");

  const queryParams = new URLSearchParams(url.search).toString();
  
  const urlFinal = `${process.env.API_BASE_URL}${filteredPath}${
    queryParams ? `?${queryParams}` : ""
  }`;
  return urlFinal
}

async function prepareHeaders(req: NextRequest): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    "Accept": "application/json",
    "Content-Type": "application/json"
  };

  req.headers.forEach((value, key) => {
    if (ALLOWED_HEADERS.includes(key)) {
      headers[key] = value;
    }
  });

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (token) {
    headers.Authorization = `Bearer ${token.access_token}`;
  }

  return headers;
}

async function prepareRequestData(req: NextRequest) {
  const isFormData = req.headers.get("content-type")?.includes("multipart/form-data") ?? false;
  const headers: Record<string, string> = {
    "Content-Type": isFormData ? "multipart/form-data" : "application/json"
  };

  const body = isFormData ? await req.formData() : await req.json();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (token) {
    headers.Authorization = `Bearer ${token.access_token}`;
  }

  return { headers, body, isFormData };
}

async function sendPatchRequest(
  url: string, 
  headers: Record<string, string>, 
  body: any, 
  isFormData: boolean
): Promise<AxiosResponse> {
  return isFormData
    ? await axios.patch(url, body, { headers })
    : await axios.patch(url, body, { headers });
}


async function sendPostRequest(
  url: string, 
  headers: Record<string, string>, 
  body: any, 
  isFormData: boolean
): Promise<AxiosResponse> {
  return isFormData
    ? await axios.post(url, body, { headers })
    : await axios.post(url, body, { headers });
}

function handleApiError(
  req: NextRequest, 
  method: HttpMethod, 
  error: unknown
) {
  const errorMessage = error instanceof Error 
    ? error.message 
    : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ';

  logRequestIfNeeded(
    req, 
    '', 
    method, 
    {}, 
    undefined, 
    { status: 500, statusText: errorMessage,data:null }
  );

  return NextResponse.json(
    { error: errorMessage },
    { status: (error as AxiosError).response?.status ?? 500 }
  );
}

function logRequestIfNeeded(
  req: NextRequest,
  endpoint: string,
  method: HttpMethod,
  headers: Record<string, string>,
  requestData: any,
  responseData: AxiosResponse | { status: number, statusText: string ,data:any}
) {
  if (process.env.NODE_ENV !== "production") {
    const logEntry = `
    ------------------------------
    date: ${new Date().toISOString()}
    method: ${method}
    route: ${req.url}
    API Endpoint: ${endpoint}
    Headers  Request: ${JSON.stringify(headers)}
    data Request: ${JSON.stringify(requestData)}
    status: ${responseData.status}
    response: ${JSON.stringify(responseData.data)}
    ------------------------------
    `;

    const logsDir = path.join(process.cwd(), "logs");
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir);
    }

    const logFileName = `api-${new Date().toISOString().split("T")[0]}.log`;
    const logFilePath = path.join(logsDir, logFileName);
    fs.appendFileSync(logFilePath, logEntry, "utf8");
  }
}