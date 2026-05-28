# Ridaos Transactional Emails Roadmap

## Estado actual

No hay envio real en este sprint.
No se activa Supabase Auth.
No se activa Stripe.
No se activa un proveedor transaccional.

## Objetivo futuro

Centralizar emails de cuenta, solicitud, archivo y produccion sin acoplarlos al storefront mock actual.

## Eventos futuros

1. Registro en la web
2. Verificacion de email
3. Olvido de contrasena
4. Pedido recibido
5. Archivo recibido
6. Archivo necesita correccion
7. Archivo aceptado para produccion
8. Pedido confirmado
9. Pedido en produccion
10. Pedido listo para recoger o enviar
11. Pedido enviado
12. Seguimiento de pedido
13. Incidencia en archivo
14. Presupuesto de rotulacion recibido
15. Presupuesto aprobado
16. Factura o confirmacion de solicitud

## Arquitectura sugerida

- `emailTemplates/`
- `transactionalEmailService`
- `transactionalEmailEvents`
- `customerCommunicationLog`
- `adminResendActions`
- `emailPreferences`
- `orderStatusToEmailMap`

## Contrato minimo sugerido

Cada evento deberia incluir:

- `eventName`
- `customerId`
- `orderId` opcional
- `artworkId` opcional
- `templateId`
- `locale`
- `payload`
- `triggeredAt`
- `deliveryStatus`

## Mapeo sugerido de pedidos y archivos

- `pending_review` -> pedido recibido
- `needs_changes` -> archivo necesita correccion
- `approved` -> archivo aceptado para produccion
- `in_production` -> pedido en produccion
- `ready` -> pedido listo para recoger o enviar
- `completed` -> pedido finalizado

## Proveedores futuros posibles

- Supabase Auth para emails de autenticacion
- Resend para plantillas y control de dominio
- SendGrid para volumen mayor o flujos transaccionales mixtos
- Mailgun como alternativa
- Stripe emails solo cuando existan pagos reales

## Guardas

- no emitir emails desde componentes React
- no mezclar copy de email con copy visual de checkout
- registrar reenvios desde admin
- dejar trazabilidad por cliente y pedido
- no prometer tiempos de entrega automatizados sin backend real

## Ajuste de copy tras QA prepress

- en storefront visible usar `Archivo aceptado`, no `archivo aceptado para produccion`
- `Ayuda de diseno solicitada` debe comunicar continuidad comercial, no cierre tecnico
- `Necesita correccion` debe explicar el ajuste sin tono de error de sistema
- cualquier email futuro sobre archivo debe hablar de `referencia de impresion` o `revision de archivo`, no de produccion automatica

## Pendientes backend futuros

- persistir auditoria de aceptacion y solicitud de ayuda por linea
- versionar reuploads y registrar motivo de correccion
- disparar eventos transaccionales solo cuando exista backend real
- conectar estados de pedido y archivo a trazabilidad de admin sin reusar copy tecnico en storefront
