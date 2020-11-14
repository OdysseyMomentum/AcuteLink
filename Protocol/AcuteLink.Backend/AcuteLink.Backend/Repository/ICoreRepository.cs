namespace AcuteLink.Backend.Repository
{
  using System.Collections.Generic;
  using System.Threading.Tasks;

  using AcuteLink.Backend.Entity;

  public interface ICoreRepository
  {
    Task<Client> AddClientAsync(string name, string entityId);

    Task ClientSetActiceAsnyc(string clientId);

    Task<List<Client>> GetClientsAsync();

    Task<Client> GetClientAsync(string clientId);

    Task<List<Entity>> GetEntitiesAsync();

    Task SendMessageAsync(ChatMessage message);

    Task<List<ChatMessage>> GetChatMessagesAsync(string clientId, string conversationPartnerId);
  }
}