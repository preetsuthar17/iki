# iki

Time-based journal app. Write notes organized by hour of the day. Auto-saves as you type.

## Architecture

- Entries stored by date and hour (0-23) in localStorage
- Storage adapter pattern separates interface from implementation (ready for database migration)
- Auto-save with 500ms debounce on content change
- Focus/blur system: only current hour is clear, others are blurred
- Textarea-based editing with native multi-line support
- Arrow key navigation between hours when at text boundaries
- Modular structure: storage interface, hooks, and components are separated
- Data structure maps directly to database schema (date, hour, content, timestamps)

## Future

- Database migration (PostgreSQL/SQLite)
- Search and filtering
- Export functionality
- Tags and categories
- Rich text support
