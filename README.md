## Instalación

Instrucciones para instalar y ejecutar el proyecto.

```bash
docker run -d -v S:/cursos2022/microservicios/rabbitMQPOC/rabbitdb:/var/lib/rabbitmq --hostname rabbit-crashcourse -p 5672:5672 -p 8081:15672 --name rabbit-crashcourse rabbitmq:3-management