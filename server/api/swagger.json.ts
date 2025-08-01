import swaggerJSDoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tucker Sales Dashboard API',
      version: '1.0.0',
      description: 'API documentation for Tucker Sales Dashboard application with dealer management, authentication, and sales analytics',
      contact: {
        name: 'API Support',
        email: 'support@tucker.com'
      }
    },
    servers: [
      {
        url: '/api',
        description: 'API Server'
      }
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'auth-token',
          description: 'Authentication token stored in HTTP-only cookie'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            statusCode: {
              type: 'integer',
              example: 400
            },
            statusMessage: {
              type: 'string',
              example: 'Bad Request'
            }
          }
        },
        Dealer: {
          type: 'object',
          properties: {
            dealer_id: { type: 'integer' },
            dealer_name: { type: 'string' },
            total_bags: { type: 'integer' },
            salesperson: { type: 'string' },
            best_dealer_rank: { type: 'integer' },
            yoy_change_percent_current_month: { type: 'number' },
            volume_tier: { type: 'string' },
            last_order_date: { type: 'string', format: 'date' }
          }
        },
        CustomerAttention: {
          type: 'object',
          properties: {
            dealer_id: { type: 'integer' },
            dealer_name: { type: 'string' },
            salesperson: { type: 'string' },
            attention_flag: { type: 'string' },
            attention_rank: { type: 'integer' },
            days_since_last_order: { type: 'integer' },
            churn_risk: { type: 'string' },
            total_bags: { type: 'integer' }
          }
        },
        User: {
          type: 'object',
          properties: {
            code: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication endpoints'
      },
      {
        name: 'Dashboard',
        description: 'Dashboard data and analytics endpoints'
      },
      {
        name: 'System',
        description: 'System health and testing endpoints'
      }
    ]
  },
  apis: ['./server/api/**/*.ts', './server/api/**/*.js'] // Paths to your API files
}

const specs = swaggerJSDoc(options)

export default defineEventHandler(() => {
  return specs
})