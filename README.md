# Employee Portal Web

Primera versión web funcional del Employee Portal. Incluye login demo por roles, dashboard, payroll, comprobantes, vacaciones, permisos, documentos, perfil, notificaciones y una vista administrativa inicial. También puede publicarse como demostración estática mediante GitHub Pages.

## Ejecutar

```bash
npm start
```

Abre `http://localhost:4173`.

Usa cualquier correo y contraseña. Un correo que incluya `hr` o `manager` activa la vista administrativa demo.

## Próxima evolución

La aplicación funciona con datos de demostración y un servidor local sin dependencias. Para producción, se deben reemplazar los endpoints demo por ASP.NET Core, PostgreSQL, almacenamiento de documentos, OIDC/MFA y auditoría persistente.

## GitHub Pages

El flujo `.github/workflows/deploy-pages.yml` publica el contenido de `public/` al hacer push a `main`. Tras crear el repositorio, activa GitHub Pages usando la fuente **GitHub Actions** en la configuración del repositorio.
