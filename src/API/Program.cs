using OpenAI;
using DotNetEnv;
using Application.Interfaces;
using Infrastructure.Services;
using Application.Services;

var builder = WebApplication.CreateBuilder(args);

DotNetEnv.Env.Load("../../.env");

// var apiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY")
//     ?? throw new InvalidOperationException("OPENAI_API_KEY not found");

// builder.Services.AddSingleton(new OpenAIClient(apiKey));

builder.Services.AddHttpClient<IOpenAiService, OpenAiService>();
builder.Services.AddScoped<IFileProcessingService, FileProcessingService>();
builder.Services.AddScoped<CvAndJobPostService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173") // React dev server
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Register controllers
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger(); 
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.UseHttpsRedirection();
app.MapControllers();
app.Run();
