import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

let client: S3Client | null = null;

const endpoint = process.env.MINIO_ENDPOINT!;
const region = process.env.MINIO_REGION || "us-east-1";
const bucket = process.env.MINIO_BUCKET || "alfascorpiix";
const expiry = Number(process.env.MINIO_URL_EXPIRY) || 3600;

function getClient(): S3Client {
	if (!client) {
		client = new S3Client({
			endpoint,
			region,
			credentials: {
				accessKeyId: process.env.MINIO_ACCESS_KEY!,
				secretAccessKey: process.env.MINIO_SECRET_KEY!,
			},
			forcePathStyle: true,
		});
	}
	return client;
}

export async function generatePresignedUrl(path: string): Promise<string> {
	const command = new GetObjectCommand({ Bucket: bucket, Key: path });
	return getSignedUrl(getClient(), command, { expiresIn: expiry });
}

export async function generatePresignedUrls(
	paths: string[],
): Promise<Record<string, string>> {
	const unique = [...new Set(paths)].filter(Boolean);
	const entries = await Promise.all(
		unique.map(async (path) => [path, await generatePresignedUrl(path)] as const),
	);
	return Object.fromEntries(entries);
}
