# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive `.env.example` documentation for better onboarding.
- Tech stack badges and architecture diagram to the `README.md`.
- Foundational API structure with structured layered architecture (Routes -> Controllers -> Services).
- Integration with Prisma ORM and PostgreSQL.
- Initial AI integration utilizing Google Gemini AI.
- Trading, news, and portfolio endpoints.

### Changed
- Refactored server configuration and environment variable handling.
- Enhanced API routing and middleware pipelines.

### Security
- Added rate-limiting middleware to protect public endpoints.

## [1.0.0] - 2026-04-15
### Added
- Initial release of the Finencial Adviser API platform.
- Basic portfolio tracking endpoints.
- News aggregation and basic sentiment analysis endpoints.
- AI Chatbot via Gemini API.