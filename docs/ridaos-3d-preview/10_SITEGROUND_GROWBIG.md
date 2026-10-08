# Runbook SiteGround GrowBig — despliegue sin añadir servicios por defecto

## Hechos oficiales verificados (octubre 2026)

SiteGround admite aplicaciones Node.js en GrowBig con hasta **5 proyectos**; permite conectar GitHub para compilar/desplegar, configuración de variables de entorno, logs, dominios temporales, SSL y bases MySQL/PostgreSQL. Estas capacidades constan en la documentación oficial, pero no prueban la configuración o recursos disponibles en esta cuenta concreta.

- https://www.siteground.com/es/blog/hosting-para-proyectos-node-js-con-siteground
- https://www.siteground.com/es/kb/crear-proyecto-node-js
- https://www.siteground.com/es/kb/que-es-proyecto-node-js

**Precaución:** un push a la rama vinculada puede desplegar automáticamente. No conectar main sin preparar rama de release/control de QA.

## Topología buscada

- Mantener www.ridaosprint.com **intacto**.
- Proyecto Node.js separado en 3d.ridaosprint.com (pendiente de DNS, certificado, plan y deployment real).
- Un único deploy de app + API; DB PostgreSQL administrada por SiteGround.
- No subir modelos/videos/arte grandes al repositorio Git.
- Procesamiento 3D pesado preferente fuera del servidor compartido; servidor coordina jobs y entrega assets.

## Verificaciones previas imprescindibles

- Cuenta GrowBig y cuántos proyectos Node.js libres quedan; Node runtime disponible y build scripts.
- Espacio utilizado/contratado, límites de upload, CPU/RAM/procesos, tiempo máximo de petición.
- Persistencia entre builds: crear archivo de prueba en ubicación de assets, redeploy y confirmar; **no** asumir que carpeta del servidor es persistente.
- Postgres: conexión desde Node, permisos mínimos, backups/export y restore.
- Jobs: ¿cron/worker durable disponible? Si no, polling desde UI + reconciliación en peticiones y eventual worker remoto solo si imprescindible.
- HTTPS, CORS, compresión/caché de GLB/KTX2, rango HTTP, tipos MIME correctos y descarga móvil.
- Logs de build, deploy/rollback, variables secretas; monitorizar latencia, errores y consumo de recursos.

## Procedimiento de liberación propuesto

1. Certificar prototipo en localhost con fixtures de cliente **sintéticos**.
2. Crear rama release candidata; ejecutar tests, lint, typecheck, build, revisión independiente.
3. Crear proyecto Node.js SiteGround de prueba en dominio temporal (acción humana autorizada).
4. Configurar secretos **desde panel**, nunca en Git o respuesta de chat.
5. Probar HTTPS, login, generación mock, upload, DB, publicación/revocación, restauración y redeploy.
6. Medir GLB pesado e iPhone en red móvil; si excede límites, optimizar.
7. Reservar y verificar DNS de subdominio sin afectar web comercial.
8. Activar rama release manualmente tras autorización; smoke E2E y rollback probado.

## Plan de rollback

Mantener release anterior, migraciones backwards-compatible, backup verificado, lista de variables/dependencias. Si fallo en DB/assets/seguridad o rendimiento, revertir sin publicar un viewer incompleto.

## No se ha hecho todavía

No hay aplicación Node.js de 3D Preview creada, credenciales configuradas, subdominio asignado ni publicación realizada.
