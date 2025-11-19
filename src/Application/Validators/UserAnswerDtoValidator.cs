using Application.DTOs.Interview;
using FluentValidation;

public class UserAnswerDtoValidator : AbstractValidator<UserAnswerDto>
{
    public UserAnswerDtoValidator()
    {
        RuleFor(user => user.Question)
            .NotEmpty()
            .WithMessage("Spørgsmålet kan ikke være tomt.");

        RuleFor(user => user.Answer)
        .Must(a => !string.IsNullOrWhiteSpace(a))
        .WithMessage("Svaret må ikke kun være mellemrum.");
    }
}
