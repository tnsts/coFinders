package com.cofinders.app.domain;

import com.cofinders.app.domain.enumeration.Contact;
import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;

/**
 * A Item.
 */
@Entity
@Table(name = "item")
@TypeDef(name = "jsonb", typeClass = JsonBinaryType.class)
public class Item implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description")
    private String description;

    @NotNull
    @Column(name = "found_at", nullable = false)
    private Instant foundAt;

    @NotNull
    @Column(name = "lat", nullable = false)
    private Double lat;

    @NotNull
    @Column(name = "lon", nullable = false)
    private Double lon;

    @Column(name = "image_src")
    private String imageSrc;

    @Type(type = "jsonb")
    @Column(name = "contacts", columnDefinition = "jsonb")
    private Map<Contact, String> contacts = new HashMap<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Item id(Long id) {
        this.id = id;
        return this;
    }

    public String getTitle() {
        return this.title;
    }

    public Item title(String title) {
        this.title = title;
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return this.description;
    }

    public Item description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Instant getFoundAt() {
        return this.foundAt;
    }

    public Item foundAt(Instant foundAt) {
        this.foundAt = foundAt;
        return this;
    }

    public void setFoundAt(Instant foundAt) {
        this.foundAt = foundAt;
    }

    public Double getLat() {
        return this.lat;
    }

    public Item lat(Double lat) {
        this.lat = lat;
        return this;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }

    public Double getLon() {
        return this.lon;
    }

    public Item lon(Double lon) {
        this.lon = lon;
        return this;
    }

    public void setLon(Double lon) {
        this.lon = lon;
    }

    public String getImageSrc() {
        return imageSrc;
    }

    public void setImageSrc(String imageSrc) {
        this.imageSrc = imageSrc;
    }

    public Map<Contact, String> getContacts() {
        return contacts;
    }

    public void setContacts(Map<Contact, String> contacts) {
        this.contacts = contacts;
    }

    public void addContact(Contact contact, String value) {
        contacts.put(contact, value);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Item)) {
            return false;
        }
        return id != null && id.equals(((Item) o).id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return (
            "Item{" +
            "id=" +
            id +
            ", title='" +
            title +
            '\'' +
            ", description='" +
            description +
            '\'' +
            ", foundAt=" +
            foundAt +
            ", lat=" +
            lat +
            ", lon=" +
            lon +
            ", imageSrc='" +
            imageSrc +
            '\'' +
            //            ", contacts=" + contacts +
            '}'
        );
    }
}
