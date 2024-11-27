# SabanaFood
Encuentra alimentos según tus preferencias, realiza pedidos a domicilio y escribe reseñas



Descripción del Proyecto
Este proyecto utiliza la API de Gemini para ofrecer respuestas personalizadas sobre alimentos basadas en consultas específicas. Además, permite a los usuarios:

Pedir domicilios de comida directamente desde la aplicación.
Escribir y leer reseñas sobre los alimentos disponibles.
Ejemplo de consulta: "¿Qué comida no tiene pepinillos?", y el sistema responderá con los resultados adecuados de una lista predefinida.

Características
Consultas Personalizadas: Obtén información sobre alimentos e ingredientes mediante consultas a la API de Gemini.
Pedidos a Domicilio: Encuentra restaurantes cercanos, selecciona alimentos y realiza pedidos fácilmente.
Reseñas de Comida: Los usuarios pueden dejar reseñas detalladas, asignar calificaciones y leer opiniones de otros usuarios.
Lista de Alimentos Personalizada: Visualiza alimentos disponibles y sus detalles en tiempo real.
Requisitos del Sistema
Node.js: v16+
npm o yarn: Última versión.
Cuenta Gemini API: Necesaria para la clave API.
React Native: Framework para aplicaciones móviles.
Instalación
Sigue estos pasos para clonar y configurar el proyecto:

Clona el repositorio:

bash:
Copy code
git clone [https://github.com/username/repo-name.git](https://github.com/DNico21/SabanaFood.git)
Instala las dependencias:

bash:
Copy code
npm install
Crea un archivo .env en la raíz del proyecto con tu clave de API de Gemini:

env:
Copy code
GEMINI_API_KEY=your-api-key
Inicia el servidor local:

bash:
Copy code
npm start
Uso
1. Consultar Información de Alimentos
Realiza preguntas personalizadas sobre alimentos.

typescript:
Copy code
import geminiService from './services/GeminiApiServiceHelper';

async function exampleUsage() {
  try {
    const response = await geminiService.sendMessageToGemini('¿Qué comida no tiene pepinillos?');
    console.log('Respuesta:', response);
  } catch (error) {
    console.error('Error:', error);
  }
}
exampleUsage();
2. Realizar Pedidos a Domicilio
Selecciona un restaurante cercano y realiza un pedido.

typescript
Copy code
import { placeOrder } from './services/OrderService';

async function orderFood() {
  try {
    const orderDetails = {
      restaurantId: '123',
      items: [
        { foodId: '456', quantity: 2 },
      ],
      address: 'Calle 123, Ciudad ABC',
    };
    const response = await placeOrder(orderDetails);
    console.log('Pedido realizado:', response);
  } catch (error) {
    console.error('Error al realizar el pedido:', error);
  }
}
orderFood();
3. Dejar una Reseña de Comida
Los usuarios pueden calificar alimentos y escribir reseñas.

typescript
Copy code
import { submitReview } from './services/ReviewService';

async function leaveReview() {
  try {
    const review = {
      foodId: '456',
      rating: 5,
      comment: '¡Delicioso, muy recomendado!',
    };
    const response = await submitReview(review);
    console.log('Reseña enviada:', response);
  } catch (error) {
    console.error('Error al enviar la reseña:', error);
  }
}
leaveReview();
Estructura del Proyecto
plaintext
Copy code
├── src/
│   ├── services/
│   │   ├── GeminiApiServiceHelper.ts  // Servicio para la API de Gemini
│   │   ├── Domicilio.ts           // Lógica de pedidos a domicilio
│   │   └── Home.ts          // Lógica para reseñas de comida
│   ├── components/
│   │   ├── FoodList.tsx              // Lista de alimentos
│   │   ├── FoodDetail.tsx            // Detalles de alimentos
│   │   ├── RestaurantList.tsx        // Lista de restaurantes cercanos
│   │   └── ReviewSection.tsx         // Sección para escribir y ver reseñas
│   ├── utils/
│   │   └── helpers.ts                // Funciones auxiliares
│   └── App.tsx                       // Entrada principal de la app
├── package.json
├── README.md
└── .env                              // Archivo para la clave de API
Contribuciones
¡Las contribuciones son bienvenidas! Sigue estos pasos:

Haz un fork del proyecto.
Crea una rama nueva:
bash
Copy code
git checkout -b feature/nueva-funcionalidad
Realiza los cambios y haz un commit:
bash
Copy code
git commit -m "Agrega nueva funcionalidad"
Envía los cambios:
bash
Copy code
git push origin feature/nueva-funcionalidad
Abre un Pull Request.


## Figma:
### https://www.figma.com/design/EImZf5Q8R3UWPLhJ3uBYdH/Untitled?node-id=0-1&m=dev&t=VakZDAeLaHNCqEvq-1 
![image](https://github.com/user-attachments/assets/5af73d06-a073-47a5-bd96-28c3d8b3229e)
### https://www.canva.com/design/DAGXn7H0hhM/P2oXzIx7I0LWA5u9D31grw/edit?utm_content=DAGXn7H0hhM&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton
![image](https://github.com/user-attachments/assets/e2a3daee-9a8a-4dce-8ab7-0a21ee5fdae4)
### https://trello.com/invite/b/6733ddbc83d6418e78938225/ATTI77fc99bdda12b983953ab2d1071382a269F0C9EF/historias-sabanafood
![image](https://github.com/user-attachments/assets/eeb2b331-a0ca-44d7-9a48-a1b1c92b8c53)


