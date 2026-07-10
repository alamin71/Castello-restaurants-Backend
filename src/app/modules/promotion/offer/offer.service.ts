import { StatusCodes } from 'http-status-codes';
import AppError from '../../../../errors/AppError';
import QueryBuilder from '../../../builder/QueryBuilder';
import { generateOfferId } from '../../../../utils/generateId';
import { IOffer } from './offer.interface';
import { Offer } from './offer.model';

const createOfferToDB = async (payload: Partial<IOffer>) => {
  payload.offerId = await generateOfferId();
  if (payload.offerItems) {
    payload.totalItems = payload.offerItems.length;
  }
  const offer = await Offer.create(payload);
  if (!offer) throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create offer');
  return offer;
};

const getOffersFromDB = async (query: Record<string, unknown>) => {
  const q = new QueryBuilder(
    Offer.find().populate('offerItems.categoryId', 'name categoryId'),
    query
  )
    .search(['title'])
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await q.modelQuery.lean();
  const meta = await q.countTotal();
  return { result, meta };
};

const getOfferByIdFromDB = async (id: string) => {
  const offer = await Offer.findById(id)
    .populate('offerItems.categoryId', 'name categoryId')
    .populate('offerItems.products.productId', 'name mainImage productId')
    .populate('offerItems.products.variantItemIds', 'name variantItemId')
    .lean();
  if (!offer) throw new AppError(StatusCodes.NOT_FOUND, 'Offer not found');
  return offer;
};

const updateOfferInDB = async (id: string, payload: Partial<IOffer>) => {
  if (payload.offerItems) {
    payload.totalItems = payload.offerItems.length;
  }
  const offer = await Offer.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!offer) throw new AppError(StatusCodes.NOT_FOUND, 'Offer not found');
  return offer;
};

const deleteOfferFromDB = async (id: string) => {
  const offer = await Offer.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  if (!offer) throw new AppError(StatusCodes.NOT_FOUND, 'Offer not found');
  return null;
};

const toggleOfferStatusInDB = async (id: string) => {
  const offer = await Offer.findById(id);
  if (!offer) throw new AppError(StatusCodes.NOT_FOUND, 'Offer not found');
  const newStatus = offer.status === 'active' ? 'inactive' : 'active';
  return Offer.findByIdAndUpdate(id, { status: newStatus }, { new: true });
};

export const OfferService = {
  createOfferToDB,
  getOffersFromDB,
  getOfferByIdFromDB,
  updateOfferInDB,
  deleteOfferFromDB,
  toggleOfferStatusInDB,
};
