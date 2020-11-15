using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace AcuteLink.Backend
{
  using AcuteLink.Backend.Core.Repository;
  using AcuteLink.Backend.Repository;

  using Microsoft.EntityFrameworkCore;
  using Microsoft.OpenApi.Models;

  using Newtonsoft.Json.Serialization;

  using Swashbuckle.AspNetCore.Filters;

  public class Startup
  {
    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
      services.AddControllers();
      services.AddDbContext<CoreRepository>(context =>
        {
          context.UseSqlite("Data Source=acutelink.db");
        });

      services.AddSwaggerGen(
        s =>
          {
            s.SwaggerDoc("v1", new OpenApiInfo { Title = "Acute Link API", Version = "1.0" });
            s.EnableAnnotations();
          });

      services.AddScoped<ICoreRepository>(p => p.GetService<CoreRepository>());
      services.AddScoped<ICapacityRepository>(p => new InMemoryCapacityRepository());

      services.AddCors(options =>
        {
          options.AddPolicy("AllowAll",
            builder => { builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader(); });
        });
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {

      app.UseDeveloperExceptionPage();

      app.UseHttpsRedirection();

      app.UseRouting();

      app.UseCors("AllowAll");

      app.UseAuthorization();

      app.UseEndpoints(endpoints =>
      {
        endpoints.MapControllers();
      });

      app.UseSwagger(
        s =>
          {
            s.PreSerializeFilters.Add(
              (swagger, httpReq) =>
                {
                  swagger.Servers = new List<OpenApiServer> { new OpenApiServer { Url = $"{httpReq.Scheme}://{httpReq.Host.Value}" } };
                });
          });

      app.UseSwaggerUI(
        s =>
          {
            s.SwaggerEndpoint("/swagger/v1/swagger.json", "Acute Link API");
            s.DocumentTitle = "Acute Link Swagger UI";
          });
    }
  }
}
