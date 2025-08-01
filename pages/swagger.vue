<template>
  <div>
    <Head>
      <Title>API Documentation</Title>
    </Head>
    <div id="swagger-ui"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(async () => {
  try {
    // First load the CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css'
    document.head.appendChild(link)

    // Then load Swagger UI Bundle
    const SwaggerUIBundle = (await import('swagger-ui-dist/swagger-ui-bundle.js')).default
    
    SwaggerUIBundle({
      url: '/api/swagger.json',
      dom_id: '#swagger-ui',
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIBundle.presets.standalone
      ],
      deepLinking: true,
      tryItOutEnabled: true,
      displayRequestDuration: true,
      docExpansion: 'list',
      filter: true,
      showExtensions: true,
      showCommonExtensions: true
    })
  } catch (error) {
    console.error('Failed to load Swagger UI:', error)
    
    // Fallback: Create a simple API documentation page
    const swaggerContainer = document.getElementById('swagger-ui')
    if (swaggerContainer) {
      swaggerContainer.innerHTML = `
        <div style="max-width: 1200px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h1 style="color: #3b4151; margin-bottom: 20px;">Tucker Sales Dashboard API</h1>
          <p style="color: #666; margin-bottom: 30px;">Interactive API documentation is loading...</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3>Available Endpoints:</h3>
            <ul style="line-height: 1.6;">
              <li><strong>GET /api/dashboard-auth</strong> - Get dashboard data with optional salesperson filter</li>
              <li><strong>GET /api/test-db</strong> - Test database connection and get sample data</li>
              <li><strong>POST /api/auth/login</strong> - User authentication</li>
              <li><strong>POST /api/auth/logout</strong> - User logout</li>
            </ul>
          </div>
          
          <div style="background: #e3f2fd; padding: 15px; border-radius: 8px;">
            <p><strong>Raw API Specification:</strong> <a href="/api/swagger.json" target="_blank" style="color: #1976d2;">View JSON</a></p>
          </div>
        </div>
      `
      
      // Try to load Swagger UI again after a delay
      setTimeout(async () => {
        try {
          const SwaggerUIBundle = (await import('https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js')).default
          SwaggerUIBundle({
            url: '/api/swagger.json',
            dom_id: '#swagger-ui'
          })
        } catch (e) {
          console.log('Swagger UI still not available, keeping fallback')
        }
      }, 2000)
    }
  }
})
</script>

<style>
html {
  box-sizing: border-box;
  overflow: -moz-scrollbars-vertical;
  overflow-y: scroll;
}

*,
*:before,
*:after {
  box-sizing: inherit;
}

body {
  margin: 0;
  background: #fafafa;
}

/* Custom styling for better integration */
#swagger-ui .topbar {
  display: none;
}

#swagger-ui .info {
  margin: 20px 0;
}

#swagger-ui .scheme-container {
  background: #f9f9f9;
  padding: 10px;
  border-radius: 4px;
  margin: 20px 0;
}

/* Loading fallback */
#swagger-ui:empty::before {
  content: "Loading API Documentation...";
  display: block;
  text-align: center;
  padding: 50px;
  font-size: 18px;
  color: #666;
}
</style>