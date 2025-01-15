# Contributing to the Career Management Flutter App

Thank you for your interest in contributing to the Career Management App! We welcome contributions from the community to help make this app a valuable resource for career management. Please take a moment to review this guide to ensure a smooth collaboration.

## Getting Started

1. **Fork the Repository**

   - Fork the repo on GitHub to your account.
   - Clone your forked repo to your local machine:

     ```bash
     git clone https://github.com/[your-username]/career-mgmt-app.git
     ```

2. **Set Up the Development Environment**

   - Ensure you have Flutter installed. You can follow the [official Flutter installation guide](https://flutter.dev/docs/get-started/install).
   - Install FVM (Flutter Version Manager) by following the [FVM installation guide](https://fvm.app/documentation/getting-started/installation) or [Fvm Package](https://pub.dev/packages/fvm).
   - Navigate to the project directory:

     ```bash
     cd career-mgmt-app
     ```

   - Install the Flutter version specified in the .fvrc file for the project using FVM:

     ```bash
     fvm install
     ```

   - Use the installed Flutter version:

     ```bash
     fvm use
     ```

   - Install the dependencies:

     ```bash
     fvm flutter pub get
     ```

3. **Run the App**

   - Connect a device or start an emulator.
   - Run the app:

     ```bash
     fvm flutter run
     ```

4. **Always Use FVM**
   - Always use FVM to manage Flutter versions.
   - Avoid using Flutter tools directly, as they may not be compatible with the specified Flutter version.
   - Use FVM to run Flutter commands, such as `flutter pub get` or `flutter run`.
   - Use FVM to manage Flutter versions, such as `fvm install` or `fvm use`.

## Contribution Guidelines

### Reporting Issues

- Search the existing issues to avoid duplicates.
- If your issue is new, open an issue with a clear title and detailed description.
- Provide steps to reproduce the issue, if applicable.
- Include screenshots or logs if relevant.

### Feature Requests

- Search the existing issues for similar feature requests.
- If your request is new, open an issue with a clear title and detailed description.
- Explain the use case and the benefit it brings to the project.
- Provide any relevant mockups or diagrams to illustrate your idea.

### Code Contributions

1. **Create a Branch**

   - Create a new branch for your feature or bugfix:

     ```bash
     git checkout -b feature/your-feature-name
     ```

2. **Make Changes**

    - Implement your changes and ensure the code is clean and well-documented.
    - Write unit tests for your changes (if required).
    - Update documentation if necessary.

3. **Run Tests**

   - Ensure all tests pass before submitting your changes:

     ```bash
     fvm flutter test
     ```

4. **Commit Your Changes**

   - Commit your changes with a descriptive commit message:

     ```bash
     git commit -m "Add feature: description of your feature"
     ```

5. **Push to Your Fork**

   - Push your changes to your forked repository:

     ```bash
     git push origin feature/your-feature-name
     ```

6. **Open a Pull Request**

    - Go to the original repository on GitHub and open a pull request.
    - Provide a clear title and description for your pull request.
    - Link to any relevant issues and provide context for the changes.
    - Request a review from the project maintainers.

## Code Style

- Follow the Flutter and Dart guidelines.
- Use `fvm flutter format` to format your code.
- Avoid large commits; make small, incremental changes.

## Communication

- Join our community on [WhatsApp] (link) for discussions and questions.
- Respect the community and follow our [Code of Conduct](CODE_OF_CONDUCT.md).
- Use GitHub issues for bug reports and feature requests.

## License

By contributing, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).

Thank you for your contributions! Together, we can make the Career Management App a great resource for everyone!
