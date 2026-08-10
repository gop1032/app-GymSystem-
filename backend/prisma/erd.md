# Diagrama ER textual

## Relaciones principales

- `User` administra autenticación, ventas y registro de asistencias.
- `Client` se relaciona con `Membership`, `Payment`, `Attendance` y `Routine`.
- `Membership` pertenece a un `Client` y puede tener varios `Payment` asociados.
- `Attendance` registra entrada/salida de un `Client` y quién la registró (`User`).
- `Trainer` puede vincularse con muchos `Client` mediante `TrainerClient`.
- `Routine` pertenece a un `Client` y a un `Trainer`; contiene muchos `Exercise`.
- `Product` tiene muchas `Sale`.
- `Sale` registra la venta de un `Product` realizada por un `User`.

## Lectura rápida del modelo

```
User 1---N Attendance
User 1---N Sale
User 1---1 Trainer
Client 1---N Membership
Client 1---N Payment
Client 1---N Attendance
Client 1---N Routine
Trainer 1---N Routine
Trainer N---N Client (via TrainerClient)
Routine 1---N Exercise
Product 1---N Sale
```

## Decisiones de negocio

- Se usa `TrainerClient` para permitir reasignación histórica de clientes.
- Los pagos se desacoplan de membresías para soportar cobros por productos o servicios adicionales.
- `Attendance` guarda timestamps separados para facilitar reportes diarios y por hora.
