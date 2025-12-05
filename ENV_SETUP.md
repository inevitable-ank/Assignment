# Environment Setup Guide

## Frontend Environment Variables

The frontend uses Vite, which requires environment variables to be prefixed with `VITE_` to be exposed to client-side code.

### Required Environment Variable

Create a `.env` file in the `my-app` directory with the following:

```env
VITE_API_URL=http://localhost:4000
```

### Important Notes

1. **Variable Naming**: In Vite, only variables prefixed with `VITE_` are exposed to the client. This prevents accidentally exposing sensitive server-side variables.

2. **Current Setup**: Your backend is running on port 4000, so the API URL should be `http://localhost:4000`.

3. **Development vs Production**: 
   - Development: `http://localhost:4000`
   - Production: Update to your production backend URL (e.g., `https://api.yourdomain.com`)

### How It Works

The frontend code uses `import.meta.env.VITE_API_URL` to read this value. If not set, it defaults to `http://localhost:4000`.

### Example `.env` file

```env
# Backend API URL
VITE_API_URL=http://localhost:4000
```

### After Creating `.env`

1. Restart your Vite dev server if it's running
2. The frontend will automatically use the API URL from the environment variable
3. All API calls will be made to the configured backend URL

### Troubleshooting

- **CORS Errors**: Make sure your backend CORS_ORIGIN includes your frontend URL (default: `http://localhost:5173`)
- **API Not Found**: Verify the backend is running on the port specified in `VITE_API_URL`
- **Environment Variable Not Working**: Make sure the variable name starts with `VITE_` and restart the dev server



