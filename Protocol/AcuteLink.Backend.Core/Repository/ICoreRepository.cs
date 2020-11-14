namespace AcuteLink.Backend.Core.Repository
{
  using System.Collections.Generic;
  using System.Threading.Tasks;

  using AcuteLink.Backend.Core.Entity;

  public interface ICoreRepository
  {
    Task<Client> AddClientAsync(string name, string entityId);

    Task ClientSetActiceAsnyc(string clientId);

    Task<List<Client>> GetClientsAsync();

    Task<Client> GetClientAsync(string clientId);

    Task<List<Entity>> GetEntitiesAsync();

    Task SendMessageAsync(ChatMessage message);

    Task<List<ChatMessage>> GetConversationChatMessagesAsync(string clientId, string conversationPartnerId);
    Task<List<ChatMessage>> GetAllChatMessagesAsync(string clientId);
  }
}