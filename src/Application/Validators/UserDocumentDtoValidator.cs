using Application.DTOs.User;
using FluentValidation;

public class UserDocumentDtoValidator : AbstractValidator<UserDocumentDto>
{
    private readonly string[] AllowedFileTypes = new[]
    {
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    };

    public UserDocumentDtoValidator()
    {
        
        RuleFor(user => user)
            .Must(user => !string.IsNullOrWhiteSpace(user.CvText) || user.CvFile != null)
            .WithMessage("Enten CV-tekst eller CV-fil skal angives.");

       
        RuleFor(user => user)
            .Must(user => !string.IsNullOrWhiteSpace(user.JobPostingText) || user.JobPostingFile != null)
            .WithMessage("Enten jobopslagstekst eller jobopslagsfil skal angives.");

        
        RuleFor(user => user.CvText)
            .MinimumLength(100)
            .When(user => !string.IsNullOrWhiteSpace(user.CvText))
            .WithMessage("CV-teksten skal være på mindst 100 tegn.");

        RuleFor(user => user.JobPostingText)
            .MinimumLength(100)
            .When(user => !string.IsNullOrWhiteSpace(user.JobPostingText))
            .WithMessage("Jobopslagsteksten skal være på mindst 100 tegn.");

        
        RuleFor(user => user.CvFile.ContentType)
        .Must(type => AllowedFileTypes.Contains(type))
        .When(user => user.CvFile != null)
        .WithMessage("CV-filen skal være en PDF eller Word-fil (.docx).");

        RuleFor(user => user.JobPostingFile.ContentType)
        .Must(type => AllowedFileTypes.Contains(type))
        .When(user => user.JobPostingFile != null)
        .WithMessage("Jobopslaget skal være en PDF eller Word-fil (.docx).");
    }
}
