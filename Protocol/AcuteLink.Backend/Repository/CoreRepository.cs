namespace AcuteLink.Backend.Repository
{
  using System;
  using System.Collections.Generic;
  using System.Diagnostics.CodeAnalysis;
  using System.Linq;
  using System.Threading.Tasks;

  using AcuteLink.Backend.Core.Entity;
  using AcuteLink.Backend.Core.Repository;

  using Microsoft.EntityFrameworkCore;

  [ExcludeFromCodeCoverage]
  public class CoreRepository : DbContext, ICoreRepository
  {
    public DbSet<Client> Clients { get; set; }

    public DbSet<Entity> Entities { get; set; }

    public DbSet<ChatMessage> Messages { get; set; }

    public CoreRepository(DbContextOptions<CoreRepository> options)
      : base(options)
    {
      this.Database.EnsureCreated();
    }

    /// <inheritdoc />
    public async Task<Client> AddClientAsync(string name, string entityId)
    {
      var entity = this.Entities.FirstOrDefault(e => e.Id == entityId);
      if (entity == null)
      {
        throw new Exception("Unknown Entity!");
      }

      var client = new Client { Id = Guid.NewGuid().ToString("N"), LastActive = DateTime.UtcNow, Name = name, Entity = entity, EntityId = entityId };
      this.Clients.Add(client);
      await this.SaveChangesAsync();

      return client;
    }

    /// <inheritdoc />
    public async Task<List<Client>> GetClientsAsync()
    {
      var clients = await this.Clients.ToListAsync();
      clients.ForEach(this.ResolveEntity);

      return clients;
    }

    private void ResolveEntity(Client c)
    {
      c.Entity = this.Entities.FirstOrDefault(e => e.Id == c.EntityId);
    }

    /// <inheritdoc />
    public async Task<Client> GetClientAsync(string clientId)
    {
      return await this.Clients.FirstOrDefaultAsync(c => c.Id == clientId);
    }

    /// <inheritdoc />
    public async Task ClientSetActiceAsnyc(string clientId)
    {
      var client = this.Clients.FirstOrDefault(c => c.Id == clientId);
      if (client == null)
      {
        return;
      }

      client.LastActive = DateTime.UtcNow;
      await this.SaveChangesAsync();
    }

    public async Task<List<Entity>> GetEntitiesAsync()
    {
      if (!await this.Entities.AnyAsync(e => e.Id == "3359fe8ddffa4e64a2c180b208b1bc75"))
      {
        this.Entities.AddRange(
          new List<Entity>
            {
              new Entity { Id = "3359fe8ddffa4e64a2c180b208b1bc75", Name = "ER" },
              new Entity { Id = "a433296a52e4456aa5eae80d69dba8fe", Name = "Coordinator" },
              new Entity { Id = "210f24c9cb5d49478cfc265def05626f", Name = "GP 1" },
              new Entity { Id = "6600947a91e849d5b92fd46f4b48cd19", Name = "GP 2" },
              new Entity { Id = "7b7b633648764b65a68133ed6eb7bcbc", Name = "Ambulance 1" }
            });

        await this.SaveChangesAsync();
      }

      return await this.Entities.ToListAsync();
    }

    /// <inheritdoc />
    public async Task SendMessageAsync(ChatMessage message)
    {
      await this.Messages.AddAsync(message);
      await this.SaveChangesAsync();
    }

    /// <inheritdoc />
    public async Task<List<ChatMessage>> GetConversationChatMessagesAsync(string clientId, string conversationPartnerId)
    {
      var client = await this.GetClientAsync(clientId);
      var conversationPartner = await this.GetClientAsync(conversationPartnerId);

      this.ResolveEntity(client);
      this.ResolveEntity(conversationPartner);

      var messages = await this.Messages.Where(m => m.SenderId == clientId && m.ReceiverId == conversationPartnerId).ToListAsync();
      messages.ForEach(
        m =>
          {
            m.Sender = client;
            m.Receiver = conversationPartner;
          });

      return messages;
    }

    /// <inheritdoc />
    public async Task<List<ChatMessage>> GetAllChatMessagesAsync(string clientId)
    {
      var client = await this.GetClientAsync(clientId);

      this.ResolveEntity(client);

      var messages = await this.Messages.Where(m => m.ReceiverId == clientId).ToListAsync();
      foreach (var message in messages)
      {
        var sender = await this.GetClientAsync(message.SenderId);
        message.Sender = sender;
        message.Receiver = client;
      }

      return messages;
    }
  }
}
