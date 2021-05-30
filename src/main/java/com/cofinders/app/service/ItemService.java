package com.cofinders.app.service;

import com.cofinders.app.domain.Item;
import com.cofinders.app.repository.ItemRepository;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Item}.
 */
@Service
@Transactional
public class ItemService {

    private final Logger log = LoggerFactory.getLogger(ItemService.class);

    private final ItemRepository itemRepository;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    /**
     * Save a item.
     *
     * @param item the entity to save.
     * @return the persisted entity.
     */
    public Item save(Item item) {
        log.debug("Request to save Item : {}", item);
        return itemRepository.save(item);
    }

    /**
     * Partially update a item.
     *
     * @param item the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Item> partialUpdate(Item item) {
        log.debug("Request to partially update Item : {}", item);

        return itemRepository
            .findById(item.getId())
            .map(
                existingItem -> {
                    if (item.getTitle() != null) {
                        existingItem.setTitle(item.getTitle());
                    }
                    if (item.getDescription() != null) {
                        existingItem.setDescription(item.getDescription());
                    }
                    if (item.getFoundAt() != null) {
                        existingItem.setFoundAt(item.getFoundAt());
                    }
                    if (item.getLat() != null) {
                        existingItem.setLat(item.getLat());
                    }
                    if (item.getLon() != null) {
                        existingItem.setLon(item.getLon());
                    }

                    return existingItem;
                }
            )
            .map(itemRepository::save);
    }

    /**
     * Get all the items.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Item> findAll() {
        log.debug("Request to get all Items");
        return itemRepository.findAll();
    }

    /**
     * Get one item by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Item> findOne(Long id) {
        log.debug("Request to get Item : {}", id);
        return itemRepository.findById(id);
    }

    /**
     * Delete the item by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Item : {}", id);
        itemRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<Item> filterByDate(Date startDate, Date endDate) {
        List<Item> allData = itemRepository.findAll();
        Stream<Item> filter =
            allData
                .stream()
                .filter(item -> item.getFoundAt().getEpochSecond() > startDate.toInstant().getEpochSecond())
                .filter(item -> item.getFoundAt().getEpochSecond() < endDate.toInstant().getEpochSecond());

        return filter.collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<Item> filterByName(String data) {
        List<Item> allData = itemRepository.findAll();
        Stream<Item> filter =
            allData.stream().filter(item -> {
                if (item.getDescription() != null) {
                    return item.getTitle().toLowerCase().contains(data.toLowerCase()) ||
                        item.getDescription().toLowerCase().contains(data.toLowerCase());
                } else {
                    return item.getTitle().toLowerCase().contains(data.toLowerCase());
                }
            });
        return filter.collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<Item> filterByLocation(Long lat, Long lon, Double distance) {
        List<Item> allData = itemRepository.findAll();
        Stream<Item> filter =
            allData.stream().filter(item -> distance(item.getLat(), item.getLon(), lat, lon) < distance);

        return filter.collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<Item> filterItems(Date startDate, Date endDate, String data, Long lat, Long lon, Double distance) {
        List<Item> allData = itemRepository.findAll();
        Stream<Item> filter = allData.stream();
        if (startDate != null && endDate != null) {
            filter =
                filter.collect(Collectors.toList())
                    .stream()
                    .filter(item -> item.getFoundAt().getEpochSecond() > startDate.toInstant().getEpochSecond())
                    .filter(item -> item.getFoundAt().getEpochSecond() < endDate.toInstant().getEpochSecond());
        } else if (data != null) {
            filter =
                filter.collect(Collectors.toList())
                    .stream()
                    .filter(item -> {
                        if (item.getDescription() != null) {
                         return item.getTitle().toLowerCase().contains(data.toLowerCase()) ||
                               item.getDescription().toLowerCase().contains(data.toLowerCase());
                        } else {
                            return item.getTitle().toLowerCase().contains(data.toLowerCase());
                        }
                    });
        } else if (lat != null && lon != null && distance != null) {
            filter =
                filter.collect(Collectors.toList())
                    .stream()
                    .filter(item -> distance(item.getLat(), item.getLon(), lat, lon) < distance);
        }

        return filter.collect(Collectors.toList());
    }

    private double distance(double lat1, double lon1, double lat2, double lon2) {
        double theta = lon1 - lon2;
        double dist = Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(theta));
        dist = Math.acos(dist);
        dist = rad2deg(dist);
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344;

        return (dist);
    }
    /* The function to convert decimal into radians */
    private double deg2rad(double deg) {
        return (deg * Math.PI / 180.0);
    }
    /* The function to convert radians into decimal */
    private double rad2deg(double rad) {
        return (rad * 180.0 / Math.PI);
    }

}
