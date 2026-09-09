/**
 * ==========================================================================
 * COMPOSANT DE PAIEMENT MODULAIRE — CHINOIS CARRIÈRE PRO
 * ==========================================================================
 * Aucune logique de paiement écrite en dur dans la page.
 * Chaque fournisseur Mobile Money est un adaptateur isolé qui expose une
 * seule méthode : checkout(order) -> Promise<string urlDePaiement>
 *
 * POUR BRANCHER UN FOURNISSEUR :
 *   1. PAYMENT_CONFIG.provider = 'pawapay' | 'cinetpay' | 'moneroo'
 *   2. PAYMENT_CONFIG.endpoint = URL de TON backend, qui crée la transaction
 *      chez le fournisseur et répond { "checkoutUrl": "https://..." }
 *
 * IMPORTANT : aucune clé d'API ne doit figurer dans ce fichier — il est
 * public. Les secrets restent sur le backend appelé par `endpoint`.
 * ==========================================================================
 */

const PAYMENT_CONFIG = {
  // 'none' = aucun paiement branché : le bouton ouvre la modale d'inscription.
  provider: 'none',
  endpoint: '',
  currency: 'XOF'
};

/* ==================== APPEL BACKEND COMMUN ==================== */
/**
 * Les trois fournisseurs suivent le même flux : le backend crée la
 * transaction (avec ses clés secrètes) et renvoie une URL de paiement vers
 * laquelle on redirige l'acheteur. Seul le champ `provider` change.
 */
async function requestCheckoutUrl(order, provider) {
  if (!PAYMENT_CONFIG.endpoint) {
    throw new Error(`PAYMENT_CONFIG.endpoint non renseigné pour « ${provider} »`);
  }

  const response = await fetch(PAYMENT_CONFIG.endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider, ...order })
  });

  if (!response.ok) {
    throw new Error(`Création de la transaction refusée (HTTP ${response.status})`);
  }

  const data = await response.json();
  if (!data.checkoutUrl) {
    throw new Error("Réponse du backend sans champ « checkoutUrl »");
  }
  return data.checkoutUrl;
}

/* ==================== ADAPTATEURS ==================== */
const PaymentProviders = {
  none: {
    label: 'Aucun (collecte de contact)',
    checkout: null // géré par le repli : ouverture de la modale
  },
  pawapay: {
    label: 'PawaPay',
    checkout: (order) => requestCheckoutUrl(order, 'pawapay')
  },
  cinetpay: {
    label: 'CinetPay',
    checkout: (order) => requestCheckoutUrl(order, 'cinetpay')
  },
  moneroo: {
    label: 'Moneroo',
    checkout: (order) => requestCheckoutUrl(order, 'moneroo')
  }
};

/* ==================== REPLI : MODALE D'INSCRIPTION ==================== */
/* Réplique volontairement openModal() de script.js : ce fichier ne doit pas
   dépendre de script.js, qui est partagé avec la landing page. La fermeture
   (croix, clic extérieur, Échap) reste gérée par initModal() de script.js. */
function openRegistrationModal() {
  const modal = document.getElementById('whatsapp-modal');
  if (!modal) return;
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

/* ==================== LIAISON DES BOUTONS ==================== */
/* Tout bouton portant data-plan devient un bouton d'achat. Le montant et le
   libellé sont lus dans le HTML : aucun prix n'est codé dans ce fichier. */
function initPayment() {
  const buttons = document.querySelectorAll('[data-plan]');
  if (!buttons.length) return;

  const provider = PaymentProviders[PAYMENT_CONFIG.provider];

  buttons.forEach((button) => {
    button.addEventListener('click', async () => {
      const order = {
        plan: button.dataset.plan,
        amount: Number(button.dataset.amount),
        installments: Number(button.dataset.installments || 1),
        label: button.dataset.label || '',
        currency: PAYMENT_CONFIG.currency
      };

      // Aucun fournisseur branché : on collecte le contact.
      if (!provider || typeof provider.checkout !== 'function') {
        openRegistrationModal();
        return;
      }

      const initialHtml = button.innerHTML;
      button.disabled = true;
      button.innerHTML = '<span>Redirection vers le paiement…</span>';

      try {
        window.location.href = await provider.checkout(order);
      } catch (error) {
        console.error('[paiement]', error);
        button.disabled = false;
        button.innerHTML = initialHtml;
        // Le visiteur ne doit pas rester bloqué si le paiement échoue.
        openRegistrationModal();
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', initPayment);
