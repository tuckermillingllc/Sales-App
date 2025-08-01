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
  // Dynamically import Swagger UI
  const SwaggerUIBundle = (await import('swagger-ui-dist/swagger-ui-bundle.js')).default
  
  SwaggerUIBundle({
    url: '/api/swagger.json',
    dom_id: '#swagger-ui',
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIBundle.presets.standalone
    ],
    layout: 'StandaloneLayout',
    deepLinking: true,
    showExtensions: true,
    showCommonExtensions: true,
    tryItOutEnabled: true
  })
})

// Add Swagger UI CSS
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css'
    }
  ]
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
</style>